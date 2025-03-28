import type { Delta } from "../types.js";
import Context from "./context.js";

class PatchContext extends Context<unknown> {
	left: unknown;
	delta: Delta;
	pipe: "patch";

	nested?: boolean;

	constructor(left: unknown, delta: Delta) {
		super();
		this.left = left;
		this.delta = delta;
		this.pipe = "patch";
	}
}

export default PatchContext;
