import {WeController} from "⚙️/examples/extentions/decorators";
import {
    BeforeDestroy,
    ControllerFunctional,
    ControllerInit
} from "⚙️/examples/extentions/decorators/classes/controller-functional";
import {RoomMesh} from "@/app/room/objects/room.object";
import {BoxGeometry, Group, Material, Mesh, MeshBasicMaterial, Object3D, Vector2, Vector3} from "three";

import {distinctUntilChanged, filter, Subscription} from "rxjs";
import gsap from 'gsap'
import {GridMesh} from "@/app/room/objects/grid.object";
import {state} from "@/app/state/state";

@WeController({
    autoMount: true,
    objects: {
        RoomMesh,
        GridMesh,
    },
})
export class RoomController extends ControllerFunctional implements ControllerInit, BeforeDestroy {
    private readonly defaultSize: Vector2 = new Vector2(4, 6);
    private readonly room = this.getObject(RoomMesh);
    private readonly grid = this.getObject(GridMesh);
    private readonly placementBlocks: { mesh: Mesh, position: Vector2 }[] = []
    private readonly gridMatrix: (Object3D | null)[][] = []
    private readonly placementGridGroup = new Group()
    private hoverSubscription: Subscription | undefined
    private clickSubscription: Subscription | undefined
    private activePlacementBlock: { mesh: Mesh, position: Vector2 } | null = null
    private offsetsMap = new WeakMap<Object3D, { offset_x: number, offset_y: number, offset_z: number }>()

    public onControllerInit(): void {
        this.clearMatrix()
        this.drawPlacementBlocks(this.defaultSize)
        this.initSubscriptions()
        this.add(this.placementGridGroup)
        // state.sbClient.from('room_textures').select().then(console.warn)
    }

    public get roomCenter(): Vector3 {
        return this.room.mesh.position
    }

    public resize(width: number, depth: number, height?: number) {
        this.room.changeSize(width, depth, height);
        this.drawPlacementBlocks(new Vector2(Math.floor(width), Math.floor(depth)))
        this.grid.changeSize(width, depth);
    }

    public putOnSelectedPlace(targetMesh: Object3D, offsets: { offset_x: number, offset_y: number, offset_z: number }): void {
        const position = this.activePlacementBlock.position
        targetMesh.position.set(
            position.x + 0.5 + offsets.offset_x,
            0.25 + offsets.offset_y,
            position.y + 0.5 + offsets.offset_z,
        )
        this.offsetsMap.set(targetMesh, offsets)
        this.gridMatrix[position.x][position.y] = targetMesh
        this.add(targetMesh)
    }

    public replaceActivePlace(targetMesh: Object3D, offsets: { offset_x: number, offset_y: number, offset_z: number }): void {
        this.clearActivePlace()
        this.putOnSelectedPlace(targetMesh, offsets)
    }

    public clearActivePlace(): void {
        const position = this.activePlacementBlock.position
        this.remove(this.gridMatrix[position.x][position.y])
        this.gridMatrix[position.x][position.y] = null
    }

    public rotateActiveObject(): void {
        const activeObj = this.gridMatrix[this.activePlacementBlock?.position.x]?.[this.activePlacementBlock?.position.y]
        if(this.offsetsMap.has(activeObj)) {
            const offsets = this.offsetsMap.get(activeObj)
            const r = (activeObj.rotation.y % (Math.PI * 2)) / (Math.PI / 2)
            if(r === 0) {
                activeObj.position.z = this.activePlacementBlock.position.y - offsets.offset_x + 0.5
                activeObj.position.x = this.activePlacementBlock.position.x + offsets.offset_z + 0.5
            } else if(r === 1) {
                activeObj.position.z = this.activePlacementBlock.position.y - offsets.offset_z + 0.5
                activeObj.position.x = this.activePlacementBlock.position.x + offsets.offset_x + 0.5
            } else if(r === 2) {
                activeObj.position.z = this.activePlacementBlock.position.y + offsets.offset_x + 0.5
                activeObj.position.x = this.activePlacementBlock.position.x - offsets.offset_z + 0.5
            } else {
                activeObj.position.z = this.activePlacementBlock.position.y + offsets.offset_z + 0.5
                activeObj.position.x = this.activePlacementBlock.position.x - offsets.offset_x + 0.5
            }
        }
        activeObj.rotation.y += Math.PI / 2
    }

    public beforeDestroy(): void {
        this.hoverSubscription?.unsubscribe()
        this.clickSubscription?.unsubscribe()
    }

    public initSubscriptions(): void {
        let tweens: gsap.core.Tween[] = []
        this.hoverSubscription = state.objectsHovered$.pipe(
            distinctUntilChanged((prev, next) => {
                if(prev.length !== next.length) {
                    return false
                }
                for(let i = 0; i < prev.length; i++) {
                    if(prev[i] !== next[i]) {
                        return false
                    }
                }
                return true
            }),
            filter(() => !state.clickedBlock$.value),
        ).subscribe((hoList: Object3D[]) => {
            tweens.forEach(tw => tw.kill())
            tweens = []

            for(let obj of this.placementBlocks) {
                if (obj.mesh.material instanceof Material) {
                    obj.mesh.material.opacity = 0
                }
                obj.mesh.position.y = 0
            }
            this.activePlacementBlock = this.placementBlocks.find(data => hoList.includes(data.mesh)) ?? null

            if(this.activePlacementBlock) {
                tweens.push(
                    gsap.to(this.activePlacementBlock.mesh.position, {
                        y: 0.125,
                        duration: 0.5,
                    }),
                    gsap.to(this.activePlacementBlock.mesh.material, {
                        opacity: 0.6,
                        duration: 0.5,
                    })
                )
            }
        })

        this.clickSubscription = state.objectsClicked$.subscribe((hoList) => {
            if(this.activePlacementBlock) {
                tweens.forEach(tw => tw.kill())
                tweens = []

                for(let obj of this.placementBlocks) {
                    if (obj.mesh.material instanceof Material) {
                        obj.mesh.material.opacity = 0
                    }
                    obj.mesh.position.y = 0
                }
                this.activePlacementBlock = this.placementBlocks.find(data => hoList.includes(data.mesh)) ?? null

                if(this.activePlacementBlock) {
                    tweens.push(
                        gsap.to(this.activePlacementBlock.mesh.position, {
                            y: 0.125,
                            duration: 0.5,
                        }),
                        gsap.to(this.activePlacementBlock.mesh.material, {
                            opacity: 0.6,
                            duration: 0.5,
                        })
                    )
                }

                state.clickedBlock$.next(this.activePlacementBlock?.mesh ?? null)
                state.clickedFurniture$.next(this.gridMatrix[this.activePlacementBlock?.position.x]?.[this.activePlacementBlock?.position.y] ?? null)
            }
        })
    }

    private clearMatrix(): void {
        this.gridMatrix.splice(0)
        for(let x = 0; x < this.defaultSize.x; x++) {
            this.gridMatrix[x] = []
            for(let y = 0; y < this.defaultSize.y; y++) {
                this.gridMatrix[x][y] = null
            }
        }
    }

    private drawPlacementBlocks(sizes: Vector2): void {
        this.placementBlocks.splice(0)
        this.placementGridGroup.clear()
        for(let x = 0; x < sizes.x; x++) {
            for(let y = 0; y < sizes.y; y++) {
                const boxGeometry = new BoxGeometry(1, 0.25, 1);
                const material = new MeshBasicMaterial({
                    color: 'white',
                    transparent: true,
                    opacity: 0
                })
                const mesh = new Mesh(boxGeometry, material)
                mesh.position.x = x + 0.5
                mesh.position.z = y + 0.5
                this.placementBlocks.push({
                    mesh: mesh,
                    position: new Vector2(x, y)
                })
                this.placementGridGroup.add(mesh)
            }
        }
    }
}