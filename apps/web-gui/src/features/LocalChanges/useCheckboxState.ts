import { useState } from "react";

export function useCheckboxState(totalCheckboxCount: number) {
    const [checkedCheckboxIndexes, setCheckedCheckboxIndexes] = useState<number[]>([]);

    function isCheckboxChecked(checkboxIndex: number) {
        return checkedCheckboxIndexes.includes(checkboxIndex);
    }

    function onCheckboxCheckedChanged(checkboxIndex: number) {
        setCheckedCheckboxIndexes(previousArray => {
            const newArray = [...previousArray];

            if (!newArray.includes(checkboxIndex)) {
                newArray.push(checkboxIndex);
            }
            else {
                const existingIndex = newArray.indexOf(checkboxIndex);
                newArray.splice(existingIndex, 1);
            }

            return newArray;
        });
    }

    function hasMoreThanOneFileSelected() {
        return checkedCheckboxIndexes.length > 0;
    }

    function isAllCheckboxesChecked() {
        if (totalCheckboxCount === 0)
            return false;

        for (let i = 0; i < totalCheckboxCount; i++) {
            if (!checkedCheckboxIndexes.includes(i))
                return false;
        }

        return true;
    }

    function onSelectAllCheckboxes() {
        if (isAllCheckboxesChecked()) {
            setCheckedCheckboxIndexes([]);
        }
        else {
            setCheckedCheckboxIndexes(() => {
                const newArray: number[] = [];
                for (let i = 0; i < totalCheckboxCount; i++)
                    newArray.push(i);

                return newArray;
            });
        }
    }

    return {
        checkedCheckboxIndexes,
        isCheckboxChecked,
        onCheckboxCheckedChanged,
        isAllCheckboxesChecked,
        onSelectAllCheckboxes,
        hasMoreThanOneFileSelected,
    };
}
