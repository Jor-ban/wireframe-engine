import { EngineExtensionInterface } from "⚙️/types/EngineExtensionInterface";
import { EngineInterface } from "⚙️/types/Engine.interface";
import { ControlDecoratorConfigInterface } from "./types/control-decorator-config.interface";

class ControlsDecoratorsExtensionFactory implements EngineExtensionInterface {
    engine: EngineInterface | null = null
    onInit(eng: EngineInterface) {
        this.engine = eng
    }

    ADD_CONTROL(config: ControlDecoratorConfigInterface) {
        return (target: any, propertyName: string) => {
            if(!this.engine) throw new Error('[ControlsDecoratorsExtension -> @AddControl] ControlsDecoratorsExtension is not added to extensions list')
            if(this.engine.mode === 'dev' && config?.addInDev) {
                this.addDevControl(target, propertyName, config)
            } else if(this.engine.mode === 'test') {
                const name = config.name ?? propertyName
                const value = config.defaultValue ?? (typeof config.type === 'string' ? '' : 0)
                setTimeout(() => {
                    (this.engine as any).testControls.pane.addInput(
                        { ...target, [name]: value },
                        name,
                        { ...config }
                    ).on('change', ({ value }: { value: number | string }) => {
                        target[propertyName] = value
                        if(config.onUpdate) config.onUpdate(target)
                    })
                })
            }
        }
    }

    public DEV_CONTROL(config: ControlDecoratorConfigInterface) {
        return (target: any, propertyName: string) => {
            if (!this.engine) throw new Error('[ControlsDecoratorsExtension -> @AddControl] ControlsDecoratorsExtension is not added to extensions list')
            if(this.engine.mode === 'dev') {
                this.addDevControl(target, propertyName, config)
            }
        }
    }

    private addDevControl(target: any, propertyName: string, config: ControlDecoratorConfigInterface) {
        const name = config.name ?? propertyName
        const value = config.defaultValue ?? (typeof config.type === 'string' ? '' : 0)
        setTimeout(() => {
            import('../../../devEngine/changeDetector/index').then(({ ChangeDetector }) => {
                ChangeDetector.clickedObject$.subscribe((obj) => {
                    if (obj === target.__object) {
                        (this.engine as any).devControls.rightControls.activeElementControls.meshTab.addInput(
                            { ...target, [name]: value },
                            name,
                            { ...config }
                        ).on('change', ({ value }: { value: number | string }) => {
                            target[propertyName] = value
                            if (config.onUpdate) config.onUpdate(target)
                        })
                    }
                })
            })
        })
    }

    get newInstance() {
        return new ControlsDecoratorsExtensionFactory()
    }
}

export const ControlsDecoratorsExtension = new ControlsDecoratorsExtensionFactory()

export const AddControl = ControlsDecoratorsExtension.ADD_CONTROL.bind(ControlsDecoratorsExtension)
export const DevControl = ControlsDecoratorsExtension.DEV_CONTROL.bind(ControlsDecoratorsExtension)