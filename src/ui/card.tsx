import React from "react";

interface CardProps {
    children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({children}) => (
    <article className="dashboard-card">
    {children}
    </article>
);

export default Card;