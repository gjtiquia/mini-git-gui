import { CenterType, CenterElement } from "./CenterElement";
import { HorizontalLineType, HorizontalLineElement } from "./HorizontalLineElement";
import { VerticalLineType, VerticalLineElement } from "./VerticalLineElement";

export interface GraphNodeOptions {
    color: string
}

export interface GraphNodeSettings {
    centerType: CenterType;
    verticalLineType: VerticalLineType;
    horizontalLineType: HorizontalLineType;
}

export function GraphNode(props: { settings: GraphNodeSettings, options: GraphNodeOptions }) {

    const strokeWidth = 16;
    const color = props.options.color;

    return (
        <div className="relative min-w-3 max-w-3">
            <div className="absolute top-0 left-0 h-full w-full flex justify-center">
                <div className="h-full min-w-full max-w-full flex flex-col justify-center">
                    <CenterElement type={props.settings.centerType} strokeWidth={strokeWidth} color={color} />
                </div>
            </div>

            <div className="absolute top-0 left-0 h-full w-full flex justify-center">
                <div className="h-full min-w-full max-w-full flex flex-col justify-center">
                    <VerticalLineElement type={props.settings.verticalLineType} strokeWidth={strokeWidth} color={color} />
                </div>
            </div>

            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center">
                <HorizontalLineElement type={props.settings.horizontalLineType} strokeWidth={strokeWidth} color={color} />
            </div>
        </div>
    );
}
