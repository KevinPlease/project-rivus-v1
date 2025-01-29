import React from "react";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {Photo} from "./photo";

export const SortablePhoto = ({ name, ...props}) => {
    const sortable = useSortable({ name });
    const {listeners, setNodeRef, transform, transition} = sortable;

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };


    return <Photo ref={setNodeRef} style={style} {...props} {...listeners} />
};
