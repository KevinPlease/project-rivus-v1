import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Photo} from "./photo";

export const SortablePhoto = (props) => {
    const sortable = useSortable({id: props.id});
    const {listeners, setNodeRef, transform, transition} = sortable;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };


    return <Photo ref={setNodeRef} style={style} {...props} {...listeners} />
};
