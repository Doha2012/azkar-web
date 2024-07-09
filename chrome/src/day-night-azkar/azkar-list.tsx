import { Button, Card, H4, ProgressBar, Tag } from "@blueprintjs/core";
import './azkar-list.css';
import { useState } from "react";

interface AzkarListProps {
    azkar: Zekr[],
    title: string,
}

interface Zekr {
    zekr: string,
    repeat?: number,
    bless?: string,
}



function AzkarList(props : AzkarListProps) {
    const [index, setIndex] = useState(0);
    const total = props.azkar?.length ?? 1;

    const nextZekr = () => {
        if(index + 1 < total) {
            setIndex(index + 1);
        }
    };
    const preZekr = () => {
        if(index > 0) {
            setIndex(index - 1);
        }
    }

    return (
        <div className='azkar-list-container'>
            <Card className='azkar-list-card'>
                <div className='azkar-wrapper'>
                    <Button icon='chevron-left' minimal={true} onClick={preZekr} />
                    <Card className='azkar-main-card'>
                        <H4> {props.title ?? ''}</H4>
                        <p>{props.azkar[index].zekr ?? ''}</p>
                        <Tag large={true} round={true}> {props.azkar[index].repeat ?? ''}</Tag>
                    </Card>
                    <Button icon='chevron-right' minimal={true} onClick={nextZekr} />
                </div>
                <ProgressBar animate={false} stripes={false} value={(index+1.0)/total} />
            </Card>
        </div>
    );
}

export default AzkarList;






