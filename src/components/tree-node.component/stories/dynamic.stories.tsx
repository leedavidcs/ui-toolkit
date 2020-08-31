import { TreeNode } from "@/components/tree-node.component";
import React, { FC } from "react";

export default { title: "general/tree-node/dynamic", component: TreeNode };

export const Standard: FC = () => {
	return (
		<TreeNode label="Fruits">
			<TreeNode label="Apple" />
			<TreeNode label="Banana">
				<TreeNode label="Info0" />
				<TreeNode label="Info1" />
			</TreeNode>
			<TreeNode label="Cherry" />
		</TreeNode>
	);
};
