import { useLocation } from "react-router-dom";

interface State {
    uuid: string;
}

export default function TaskComments() {
    const { state } = useLocation<State>();

    return (<></>);
}