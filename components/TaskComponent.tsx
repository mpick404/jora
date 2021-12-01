import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';
import { Draggable } from 'react-beautiful-dnd';

const UpdateTaskMutation = gql`
  mutation UpdateTaskMutation($id: String!, $title: String, $description: String, $userId: String, $status: String) {
    updateTask(description: $description, id: $id, title: $title, userId: $userId, status: $status) {
      id
      title
      description
      status
    }
  }
`

const TaskComponent: React.FC<Task> = ({ title, description, id, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState(title);
  const [taskDescription, setTaskDescription] = useState(description);
  const [updateTask, { data, loading, error }] = useMutation(UpdateTaskMutation);

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const handleTaskUpdate = (e) => {
    e.preventDefault();
    updateTask({ variables: { title: taskTitle, description: taskDescription, id: id}});
    handleClose();
  }

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided) => (
          <Card className="task-container" onClick={() => handleShow()} {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
            <Card.Body>{title}</Card.Body>
          </Card>
        )}
      </Draggable>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Update a Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleTaskUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" style={{ height: '100px'}} value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)}></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Assign To</Form.Label>
                <Form.Select aria-label="Assign To">
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
    </>
  )
}

export default TaskComponent;
