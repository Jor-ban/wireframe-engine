export interface AssetsTree {
    name: string;
    isFolder ?: boolean;
    children?: AssetsTree[];
}