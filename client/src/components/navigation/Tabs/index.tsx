import './tabs.scss';

interface Tab {
    route: string,
    label: string    
}

interface Props {
    tabs: [Tab, Tab]
}

export default function Tabs({tabs}: Props) {

}