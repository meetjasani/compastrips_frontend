import React from "react";

interface Props {
    ulClassName: string;
    liClassName: string;
    children?: React.ReactNode;

}

const Tabs: React.FC<Props> = ({ ulClassName, liClassName, children }) => {
    return (
        <>
            <ul className={ulClassName}>
                <li className={liClassName}>
                    {children}
                </li>
            </ul>
        </>
    );
};

export default Tabs;
