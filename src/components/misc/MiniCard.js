import React from 'react'
import { Card } from 'react-bootstrap'

export default function MiniCard({ title, value, red }) {

    return (
        <Card className={"text-center card-custom-class flex-grow-1 mr-auto ml-auto mt-3 " + ((red) ? "text-success" : "")}>
            <Card.Header as="h6">{title}</Card.Header>
            <Card.Body>
                <Card.Title as="h4">{value}</Card.Title>
            </Card.Body>
        </Card>

    )
}
