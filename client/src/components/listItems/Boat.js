import React, { useState } from 'react'
import { useQuery } from '@apollo/client'

import { Card, List } from 'antd'

import { EditOutlined } from '@ant-design/icons'
import UpdateBoat from '../forms/UpdateBoat'
import RemoveBoat from '../buttons/RemoveBoat'

import { GET_PERSON } from '../../queries'

const getStyles = () => ({
    card: {
        width: '500px'
    }
})

const Boat = props => {
    const [id] = useState(props.id)
    const [year, setYear] = useState(props.year)
    const [make, setMake] = useState(props.make)
    const [model, setModel] = useState(props.model)
    const [price, setPrice] = useState(props.price)
    const [personId, setPersonId] = useState(props.personId)
    const [editMode, setEditMode] = useState(false)
    const styles = getStyles()

    const updateStateVariable = (variable, value) => {
        switch (variable) {
            case 'year':
                setYear(value)
                break
            case 'make':
                setMake(value)
                break
            case 'model':
                setModel(value)
                break
            case 'price':
                setPrice(value)
                break
            case 'personId':
                setPersonId(value)
                break
            default:
                break
        }
    }

    const handleButtonClick = () => setEditMode(!editMode)

    const { loading, error, data } = useQuery(GET_PERSON, {
        variables: { id: personId },
    })
    if (loading) return 'Loading...'
    if (error) return `Errror! ${error.message}`

    return (
        <List.Item key={props.id}>
            {editMode ? (
                <UpdateBoat
                    id={id}
                    year={year}
                    make={make}
                    model={model}
                    price={price}
                    personId={personId}
                    onButtonClick={handleButtonClick}
                    updateStateVariable={updateStateVariable}
                />
            ) : (
                <Card
                    actions={[
                        <EditOutlined key='edit' onClick={handleButtonClick} />,
                        <RemoveBoat id={id} year={year} make={make} model={model} price={price} personId={personId} />
                    ]}
                    style={styles.card}
                >
                    <p>{year}</p>
                    <p>{make}</p>
                    <p>{model}</p>
                    <p>{price}</p>
                    <p>{data.person.firstName}</p>
                </Card>
            )}
        </List.Item>
    )
}

export default Boat