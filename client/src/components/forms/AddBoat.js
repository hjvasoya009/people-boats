import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'

import { Form, Input, Button, Select } from 'antd'

import { v4 as uuidv4 } from 'uuid'

import { ADD_BOAT, GET_PEOPLE, GET_BOATS } from '../../queries'

const { Option } = Select;

const AddBoat = () => {
    const [id] = useState(uuidv4())
    const [addBoat] = useMutation(ADD_BOAT)

    const [form] = Form.useForm()
    const [, forceUpdate] = useState()

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({})
    }, [])

    const onFinish = values => {
        const { year, make, model, price, personId } = values

        addBoat({
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
                addPerson: {
                    __typename: 'Boat',
                    id,
                    year,
                    make,
                    model,
                    price,
                    personId
                }
            },
            update: (proxy, { data: { addBoat } }) => {
                const data = proxy.readQuery({ query: GET_BOATS })
                proxy.writeQuery({
                    query: GET_BOATS,
                    data: {
                        ...data,
                        allBoats: [...data.allBoats, addBoat]
                    }
                })
            }
        })
    }

    const { loading, error, data } = useQuery(GET_PEOPLE)
    if (loading) return 'Loading...'
    if (error) return `Errror! ${error.message}`

    return (
        <Form
            form={form}
            name='add-person-form'
            layout='inline'
            onFinish={onFinish}
            size='large'
            style={{ marginBottom: '40px' }}
        >
            <Form.Item
                name='year'
                rules={[{ required: true, message: 'Please input boat year!' }]}
            >
                <Input placeholder='i.e. 2021' />
            </Form.Item>
            <Form.Item
                name='make'
                rules={[{ required: true, message: 'Please input boat make!' }]}
            >
                <Input placeholder='i.e. Nissan' />
            </Form.Item>
            <Form.Item
                name='model'
                rules={[{ required: true, message: 'Please input boat model!' }]}
            >
                <Input placeholder='i.e. Murano' />
            </Form.Item>
            <Form.Item
                name='price'
                rules={[{ required: true, message: 'Please input boat price!' }]}
            >
                <Input placeholder='i.e. 45000' />
            </Form.Item>
            <Form.Item
                name='personId'
                rules={[{ required: true, message: 'Please select owner of the boat!' }]}
            >
                <Select style={{ width: 120 }} placeholder="Owner">
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
                        disabled={
                            !form.isFieldsTouched(true) ||
                            form.getFieldsError().filter(({ errors }) => errors.length).length
                        }
                    >
                        Add Boat
                    </Button>
                )}
            </Form.Item>
        </Form>
    )
}

export default AddBoat
