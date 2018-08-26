import React from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Row,
  ListGroup
} from "reactstrap";
import validator from "validator";
import { Task } from "./Task";
import { RowWithMargin } from "./styledComponents";
import { postNewTask } from "../common/api";
import { REQUEST_STATUSES, COMPLETION_STATUSES } from "../common/constants";
import { getErrorString, isFilled, validateForm, objToFormData } from "../common/utils";

const initialFormData = {
  email: "",
  text: "",
  username: "",
  image: null
};

const validators = {
  email: validator.isEmail,
  text: isFilled,
  username: isFilled,
  image: val => !!val
};

export class CreateTaskForm extends React.Component {
  constructor() {
    super();
    this.state = this.getInitialState();
  }

  getInitialState = () => ({
    isSubmitting: false,
    formData: initialFormData,
    isPreviewShown: false,
    imageSrc: ""
  });

  closeModal = () => {
    this.props.toggleModal();
    this.setState({ formData: initialFormData });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.submitFormData();
  };

  submitFormData = () => {
    this.setState({ isSubmitting: true });

    const formData = objToFormData(this.state.formData);

    postNewTask(formData).then(({ data: { status, message } }) => {
      if (status === REQUEST_STATUSES.success) {
        this.setState(this.getInitialState());
        this.props.toggleModal();
        this.props.onTaskAdded();
      } else {
        this.setState({ isSubmitting: false });
        alert(getErrorString(message));
      }
    });
  };

  isFormValid = () => {
    const { formData } = this.state;
    return validateForm(validators, formData);
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleFileSelect = ({ target: { files, name } }) => {
    const file = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        imageSrc: reader.result,
        formData: { ...this.state.formData, [name]: file }
      });
    };
  };

  togglePreview = () =>
    this.setState({ isPreviewShown: !this.state.isPreviewShown });

  render() {
    const {
      isPreviewShown,
      isSubmitting,
      imageSrc,
      formData: { email, text, username }
    } = this.state;
    const { toggleModal, isOpen } = this.props;

    const isFormValid = this.isFormValid();

    return (
      <Modal isOpen={isOpen} size="lg">
        <ModalHeader>Create new task</ModalHeader>
        <ModalBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Label for="username" xs={2}>
                Username:
              </Label>
              <Col xs={10}>
                <Input
                  onChange={this.handleChange}
                  value={username}
                  name="username"
                  id="username"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="email" xs={2}>
                Email:
              </Label>
              <Col xs={10}>
                <Input
                  onChange={this.handleChange}
                  value={email}
                  name="email"
                  id="email"
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Label for="text">Task:</Label>
              <Input
                onChange={this.handleChange}
                value={text}
                type="textarea"
                name="text"
                id="text"
              />
            </FormGroup>
            <FormGroup>
              <Label for="image">Image:</Label>
              <Input
                onChange={this.handleFileSelect}
                type="file"
                name="image"
                id="image"
                accept=".jpg, .gif, .png"
              />
              <FormText color="muted">
                Image must be in JPG/GIF/PNG format.
              </FormText>
            </FormGroup>
          </Form>
          <RowWithMargin>
            <Col xs={12}>
              <Button onClick={this.togglePreview} disabled={!isFormValid}>
                Preview
              </Button>
            </Col>
          </RowWithMargin>
          <Row>
            <Col xs={12}>
              {isFormValid &&
                isPreviewShown && (
                  <ListGroup>
                    <Task
                      username={username}
                      isAdmin={false}
                      email={email}
                      text={text}
                      image_path={imageSrc}
                      status={COMPLETION_STATUSES.incomplete}
                    />
                  </ListGroup>
                )}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            disabled={!isFormValid || isSubmitting}
            onClick={this.submitFormData}
          >
            Submit
          </Button>{" "}
          <Button onClick={toggleModal} color="secondary">
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
