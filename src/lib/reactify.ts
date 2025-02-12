import * as React from "react";
import { mount, unmount, type Component } from "svelte";
import { render } from "svelte/server";
import type { SvelteEventHandlers } from "./internal/types";
import SvelteToReactContext from "./internal/SvelteToReactContext.js";
import SvelteWrapper from "./internal/SvelteWrapper.svelte";

const server = typeof document === "undefined";

let $$payload: any;
export type SvelteConstructor<Props = any, Events = any, Slot = any> = {
  name: string;
  prototype: {
    $$prop_def: Props;
    $$events_def: Events;
    $$slot_def: Slot;
  };
};

type PathToValue<P extends string, V> = P extends `${infer Key}.${infer Rest}`
  ? { [K in Key]: PathToValue<Rest, V> }
  : { [K in P]: V };

type RestrictedSvelteProps<MountPath extends string | undefined> = MountPath extends string
  ? Partial<PathToValue<MountPath, never>> & { children?: never }
  : { children?: never };

type Reactified<Props> = React.FunctionComponent<
  Props & { children?: React.ReactNode }
>;

type PropsFromSvelteComponent<T extends Component | SvelteConstructor> =
  T extends Component<infer Props>
  ? Props
  : T extends SvelteConstructor<infer Props>
  ? Props
  : never;

/**
 * Convert a Svelte component into a React component.
 */
export default function reactify<
  T extends
  | Component<RestrictedSvelteProps<MountPath>>
  | SvelteConstructor<RestrictedSvelteProps<MountPath>>,
  MountPath extends string | undefined = undefined,
>(
  SvelteComponent: T,
  mountFunctionPath?: MountPath,
): T extends Component<infer Props, infer Exports>
  ? Props extends Record<string, never>
  ? Reactified<MountPath extends string ? PathToValue<MountPath, (exports: Exports) => any> : {}>
  : Reactified<Props & (MountPath extends string ? PathToValue<MountPath, (exports: Exports) => any> : {})>
  : T extends SvelteConstructor<infer Props, infer Events>
  ? Reactified<Props & SvelteEventHandlers<Events>>
  : never {
  const { name } = SvelteComponent as any;
  type Props = PropsFromSvelteComponent<T>;

  const getMountFunction = (options: any): ((exports: any) => any) | undefined => {
    if (!mountFunctionPath) return undefined;
    return mountFunctionPath.split('.').reduce((obj, key) => obj?.[key], options);
  };

  const named = {
    [name](options: any) {
      const { children, ...props } =
        options as {
          children?: React.ReactNode;
        } & Props;

      const wrapperRef = React.useRef<HTMLElement>();
      const sveltePropsRef = React.useRef<(props: Props) => void>();
      const svelteChildrenRef = React.useRef<HTMLElement>();
      const reactChildrenRef = React.useRef<HTMLElement>();
      const node = React.useContext(SvelteToReactContext);
      const { key, context } = node ?? {};

      // Mount the Svelte component
      React.useEffect(() => {
        const target = wrapperRef.current;
        if (!target || !key) {
          return undefined;
        }
        const component = mount(SvelteWrapper, {
          target,
          props: {
            SvelteComponent: SvelteComponent as any,
            onWrappedMounted: getMountFunction(options),
            nodeKey: key,
            react$children: children,
            props,
            setSlot: (el: HTMLElement | undefined) => {
              if (el && reactChildrenRef.current) {
                el.appendChild(reactChildrenRef.current);
              }
              svelteChildrenRef.current = el;
            },
          },
          context,
        });
        sveltePropsRef.current = (globalThis as any).$$reactifySetProps;

        return () => {
          unmount(component);
        };
      }, [wrapperRef]);

      // Sync props & events
      React.useEffect(() => {
        if (sveltePropsRef.current) {
          sveltePropsRef.current(props as Props);
        }
      }, [props, sveltePropsRef]);

      // Sync children/slot
      React.useEffect(() => {
        if (reactChildrenRef.current) {
          if (
            svelteChildrenRef.current &&
            reactChildrenRef.current.parentElement !== svelteChildrenRef.current
          ) {
            svelteChildrenRef.current.appendChild(reactChildrenRef.current);
          }
        } else if (svelteChildrenRef.current) {
          svelteChildrenRef.current.innerHTML = "";
        }
      }, [reactChildrenRef]);

      if (server) {
        let html = "";
        if ($$payload) {
          const len = $$payload.out.length;
          (SvelteWrapper as any)($$payload, {
            SvelteComponent,
            nodeKey: key,
            props,
            react$children: children,
          });
          html = $$payload.out.slice(len);
          $$payload.out = $$payload.out.slice(0, len);
        } else {
          const result = render(SvelteComponent as any, {
            props: props as Props,
            context,
          });
          html = result.html;
        }
        return [
          React.createElement("react-portal-target", {
            node: key,
            style: { display: "contents" },
            dangerouslySetInnerHTML: { __html: html },
          }),
          ...(children
            ? [
              React.createElement(
                "react-children",
                {
                  node: key,
                  style: { display: "none" },
                },
                children,
              ),
            ]
            : []),
        ];
      }

      return React.createElement(
        "react-portal-target",
        {
          ref: wrapperRef,
          node: key,
          style: { display: "contents" },
        },
        children
          ? React.createElement(
            "react-children",
            {
              ref: reactChildrenRef,
              node: key,
              style: { display: "none" },
            },
            children,
          )
          : undefined,
      );
    },
  };
  return named[name] as any;
}

export function setPayload(payload: any) {
  $$payload = payload;
}
