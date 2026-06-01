import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * useGSAPContext — wraps all GSAP animations in a context
 * tied to a root ref for safe, automatic cleanup on unmount.
 *
 * Usage:
 *   const { ref, ctx } = useGSAPContext(() => {
 *     gsap.from(".my-el", { opacity: 0 });
 *   }, []);
 */
export function useGSAPContext(setup, deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(setup, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/**
 * useGSAPTimeline — returns a GSAP timeline that auto-kills on unmount.
 */
export function useGSAPTimeline(setup, deps = []) {
  const tl = useRef(null);

  useEffect(() => {
    tl.current = gsap.timeline();
    setup(tl.current);
    return () => {
      if (tl.current) tl.current.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return tl;
}
