import {BehaviorSubject} from "rxjs";
import {Object3D} from "three";
import {createClient} from "@supabase/supabase-js";
import {SCHEMAS} from "@/app/schemas";
import {IFurniture} from "@/app/schemas/furniture.interface";

const SUPABASE_URL= "https://xxilzpuxvutbrrhrfyza.supabase.co"
const SUPABASE_KEY= "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4aWx6cHV4dnV0YnJyaHJmeXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NTgyNDcsImV4cCI6MjA1ODAzNDI0N30.Noe5_hf_iaAMSt8FEWJFMQ95tk0MWqFIEsr4LpKWa2E"


export const state = {
    objectsClicked$: new BehaviorSubject<Object3D[]>([]),
    objectsHovered$: new BehaviorSubject<Object3D[]>([]),
    clickedBlock$: new BehaviorSubject<Object3D | null>(null),
    clickedFurniture$: new BehaviorSubject<Object3D | null>(null),
    objectAddRequested$: new BehaviorSubject<IFurniture | null>(null),
    activeObjectRemovalRequest$: new BehaviorSubject<void>(undefined),
    activeObjectRotationRequest$: new BehaviorSubject<void>(undefined),
    activeObjectReplaceRequest$: new BehaviorSubject<IFurniture | null>(null),
    roomTextureChanged$: new BehaviorSubject<null>(null),
    loadingInProgress$: new BehaviorSubject<boolean>(false),
    sbClient: createClient<SCHEMAS>(SUPABASE_URL, SUPABASE_KEY)
}