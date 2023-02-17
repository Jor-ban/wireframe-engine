import { Group } from 'three';
import { ObjectsContainer } from '../objectsContainer';

class GroupServiceFactory {
    groupCollapseStatuses: WeakMap<Group, boolean> = new WeakMap();

    public addCollapse(group: Group, container: HTMLElement) {
        const dropDownContainer = document.createElement('div')
        dropDownContainer.classList.add('__wireframe-elements-group-dropdown')
        container.parentNode?.appendChild(dropDownContainer)
        dropDownContainer.appendChild(container)
        const childElementsContainer = document.createElement('div')
        dropDownContainer.appendChild(childElementsContainer)
        childElementsContainer.classList.add('__wireframe-elements-group-dropdown-children')
        if(!this.groupCollapseStatuses.get(group)) {
            childElementsContainer.classList.add('__wireframe-d-none')
        }
        container.addEventListener('click', () => {
            this.groupCollapseStatuses.set(group, !this.groupCollapseStatuses.get(group))
            childElementsContainer.classList.toggle('__wireframe-d-none')
        })
        new ObjectsContainer(group.children, childElementsContainer)
    }
    public isCollapsed(group: Group) {
        return this.groupCollapseStatuses.get(group)
    }
}

export const GroupService = new GroupServiceFactory();