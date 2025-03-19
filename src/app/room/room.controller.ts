import {WeController} from "⚙️/examples/extentions/decorators";
import {ControllerFunctional} from "⚙️/examples/extentions/decorators/classes/controller-functional";
import {RoomMesh} from "@/app/room/objects/room.object";
import {GridMesh} from "@/app/room/objects/grid.object";
import {Vector3} from "three";

@WeController({
    autoMount: true,
    objects: {
        RoomMesh,
        GridMesh,
    },
})
export class RoomController extends ControllerFunctional {
    private readonly room = this.getObject(RoomMesh);
    private readonly grid = this.getObject(GridMesh);

    public get roomCenter(): Vector3 {
        return this.room.mesh.position
    }

    public resize(width: number, depth: number, height?: number) {
        this.room.changeSize(width, depth, height);
        this.grid.changeSize(width, depth);
    }
}