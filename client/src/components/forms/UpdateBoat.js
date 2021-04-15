import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { Form, Input, Button, Select } from 'antd'
const { Option } = Select;
import { UPDATE_BOAT, GET_PEOPLE, GET_BOATS } from '../../queries'

const UpdateBoat = props => {
    const [id] = useState(props.id)
    const [year, setYear] = useState(props.year)
    const [make, setMake] = useState(props.make)
    const [model, setModel] = useState(props.model)
    const [price, setPrice] = useState(props.price)
    const [personId, setPersonId] = useState(props.personId)
    const [updateBoat] = useMutation(UPDATE_BOAT)

    const [form] = Form.useForm()
    const [, forceUpdate] = useState()

    useEffect(() => {
        forceUpdate({})
    }, [])

    const onFinish = values => {
        const { year, make, model, price, personId } = values
        updateBoat({
            variables: {
                id,
                year,
                make,
                model,
                price,
                personId
            },
            optimisticResponse: {
                __typename: 'Mutation',
                updateBoat: {
                    __typename: 'Boat',
                    id,
                    year,
                    make,
                    model,
                    price,
                    personId
                }
            },
            update: (proxy, { data: { updateBoat } }) => {
                const data = proxy.readQuery({ query: GET_BOATS })
                proxy.writeQuery({
                    query: GET_BOATS,
                    data: {
                        ...data,
                        allBoats: [...data.allBoats, updateBoat]
                    }
                })
            }
        })
        props.onButtonClick()
    }

    const updateStateVariable = (variable, value) => {
        switch (variable) {
            case 'year':
                props.updateStateVariable('year', value)
                setYear(value)
                break
            case 'make':
                props.updateStateVariable('make', value)
                setMake(value)
                break
            case 'model':
                props.updateStateVariable('model', value)
                setModel(value)
                break
            case 'price':
                props.updateStateVariable('price', value)
                setPrice(value)
                break
            case 'personId':
                props.updateStateVariable('personId', value)
                setPersonId(value)
                break
            default:
                break
        }
    }

    const { loading, error, data } = useQuery(GET_PEOPLE)
    if (loading) return 'Loading...'
    if (error) return `Errror! ${error.message}`

    return (
        <Form
            form={form}
            name='update-boat-form'
            layout='inline'
            onFinish={onFinish}
            initialValues={{
                year: year,
                make: make,
                model: model,
                price: price,
                personId: personId
            }}
            size='large'
        >
            <Form.Item
                name='year'
                label='year'
                rules={[{ required: true, message: 'Please input boat year!' }]}
            >
                <Input
                    placeholder='i.e. 2018'
                    value={year}
                    onChange={e => updateStateVariable('year', e.target.value)}
                />
            </Form.Item>
            <Form.Item
                name='make'
                label='make'
                rules={[{ required: true, message: 'Please input boat make!' }]}
            >
                <Input
                    placeholder='i.e. Mastercraft'
                    onChange={e => updateStateVariable('make', e.target.value)}
                />
            </Form.Item>
            <Form.Item
                name='model'
                label='model'
                rules={[{ required: true, message: 'Please input boat model!' }]}
            >
                <Input
                    placeholder='i.e. Prostar 214'
                    onChange={e => updateStateVariable('model', e.target.value)}
                />
            </Form.Item>
            <Form.Item
                name='price'
                label='price'
                rules={[{ required: true, message: 'Please input boat price!' }]}
            >
                <Input
                    placeholder='i.e. 13000'
                    onChange={e => updateStateVariable('price', e.target.value)}
                />
            </Form.Item>
            <Form.Item
                name='personId'
                rules={[{ required: true, message: 'Please select owner of the boat!' }]}
            >
                <Select style={{ width: 120 }} placeholder="Owner" value={personId}>
                    {data.people.map(({ id, firstName }) => (
                        <Option key={id} value={id} >{firstName}</Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item shouldUpdate={true}>
                {() => (
                    <Button
                        type='primary'
                        htmlType='submit'
                    >
                        Update Boat
                    </Button>
                )}
            </Form.Item>
            <Button onClick={props.onButtonClick}>Cancel</Button>
        </Form>
    )
}

export default UpdateBoat