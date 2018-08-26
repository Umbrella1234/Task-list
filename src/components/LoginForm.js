import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import { isEqual } from "lodash";
import { isFilled, validateForm } from "../common/utils";
import { ADMIN_CREDENTIALS } from "../common/constants";

const validators = {
  login: isFilled,
  password: isFilled
};

const initialFormData = {
  login: "",
  password: ""
};

export class LoginForm extends React.Component {
  state = {
    formData: initialFormData
  };

  handleChange = ({ target: { name, value } }) => {
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.submitFormData();
  };

  submitFormData = () => {
    const { formData } = this.state;
    const isAdmin = isEqual(formData, ADMIN_CREDENTIALS);

    if (isAdmin) {
      this.props.setAdmin();
      this.props.closeModal();
      this.setState({ formData: initialFormData });
    } else {
      alert("Incorrect credentials for admin!!");
    }
  };

  render() {
    const {
      formData: { login, password }
    } = this.state;
    const { isOpen, closeModal } = this.props;
    const isFormValid = validateForm(validators, this.state.formData);

    return (
      <div>
        <Modal isOpen={isOpen}>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup row>
                <Label for="login" xs={2}>
                  login:
                </Label>
                <Col xs={10}>
                  <Input
                    onChange={this.handleChange}
                    value={login}
                    name="login"
                    id="login"
                  />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="password" xs={2}>
                  Password:
                </Label>
                <Col xs={10}>
                  <Input
                    onChange={this.handleChange}
                    value={password}
                    name="password"
                    id="password"
                    type="password"
                  />
                </Col>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={this.submitFormData}
              disabled={!isFormValid}
              color="primary"
            >
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={closeModal}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
