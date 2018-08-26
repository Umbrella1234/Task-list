import React, { Component } from "react";
import { Container, Col, Button } from "reactstrap";
import md5 from "md5";
import styled from "styled-components";
import { PaginatedList } from "./PaginatedList";
import { fetchTasks, editTask } from "../common/api";
import { objToParamsString, objToFormData } from "../common/utils";
import { Task } from "./Task";
import { CreateTaskForm } from "./CreateTaskForm";
import { LoginForm } from "./LoginForm";
import { RowWithMargin } from "./styledComponents";
import { Block } from "./Block";

const ITEMS_PER_PAGE = 3;

const BtnPanel = styled(Col)`
  display: flex;
  justify-content: flex-end;
`;

const NewTaskBtn = styled(Button)`
  margin-left: 10px;
`;

const AppWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

class App extends Component {
  state = {
    isAdmin: false,
    tasks: [],
    areTasksLoading: false,
    isCreateFormOpen: false,
    isLoginFormOpen: false,
    sortField: "id",
    activePageNumber: 1,
    totalPages: 1
  };

  componentDidMount() {
    this.getTasks();
  }

  getTasks = (pageToRequest = 1) => {
    const { sortField } = this.state;
    this.setState({ areTasksLoading: true });

    return fetchTasks(sortField, "asc", pageToRequest)
      .then(({ data: { message: { total_task_count, tasks } } }) => {
        this.setState({
          totalPages: Math.ceil(total_task_count / ITEMS_PER_PAGE),
          tasks,
          areTasksLoading: false,
          activePageNumber: pageToRequest
        });
      })
      .catch(e => console.log(e));
  };

  renderTasks = ({ id, email, image_path, status, text, username }) => {
    const { isAdmin } = this.state;

    return (
      <Task
        key={id}
        id={id}
        username={username}
        isAdmin={isAdmin}
        email={email}
        text={text}
        image_path={image_path}
        status={status}
        onEditTask={this.handleEditTask}
      />
    );
  };

  handleEditTask = (id, data) => {
    const token = "beejee";
    const paramsString = objToParamsString({ ...data, token });
    const encodedParams = encodeURI(paramsString);
    const signature = md5(encodedParams);
    const formData = objToFormData({
      ...data,
      signature,
      token: "beejee"
    });

    editTask(formData, id, encodedParams).then(() => {
      const updatedTasks = this.state.tasks.map(task => {
        if (task.id === id) {
          return { ...task, ...data };
        }
        return task;
      });

      this.setState({
        tasks: updatedTasks
      });
    });
  };

  toggleCreateForm = () =>
    this.setState({ isCreateFormOpen: !this.state.isCreateFormOpen });

  handleChange = ({ target: { name, value } }) => {
    this.setState(
      {
        [name]: value,
        activePageNumber: 1
      },
      this.getTasks
    );
  };

  setActivePage = pageNum => {
    this.setState({ activePageNumber: pageNum }, () => this.getTasks(pageNum));
  };

  onTaskAdded = () => {
    const { activePageNumber, tasks, totalPages } = this.state;

    const isLastPageShown = activePageNumber === totalPages;
    const shouldChangePage = tasks.length % 3 === 0 && isLastPageShown;
    const pageToRequest = shouldChangePage
      ? activePageNumber + 1
      : activePageNumber;

    this.getTasks(pageToRequest);
  };

  toggleLoginModal = () =>
    this.setState({ isLoginFormOpen: !this.state.isLoginFormOpen });

  toggleIsAdmin = () => this.setState({ isAdmin: !this.state.isAdmin });

  render() {
    const {
      isAdmin,
      areTasksLoading,
      tasks,
      activePageNumber,
      totalPages,
      sortField,
      isCreateFormOpen,
      isLoginFormOpen
    } = this.state;

    const hasTasks = !!tasks.length;

    return (
      <AppWrapper>
        <Container>
          <RowWithMargin>
            <Col xs={12}>
              <h1>Tasks:</h1>
            </Col>
          </RowWithMargin>
          <Block isLoading={areTasksLoading}>
            <RowWithMargin>
              <Col xs={4}>
                {hasTasks && (
                  <React.Fragment>
                    Sort by:{" "}
                    <select
                      onChange={this.handleChange}
                      value={sortField}
                      name="sortField"
                    >
                      <option value="id">id</option>
                      <option value="username">username</option>
                      <option value="email">email</option>
                      <option value="status">status</option>
                    </select>
                  </React.Fragment>
                )}
              </Col>
              <Col xs={8}>
                <BtnPanel>
                  <Button
                    color="primary"
                    onClick={
                      isAdmin ? this.toggleIsAdmin : this.toggleLoginModal
                    }
                  >
                    {isAdmin ? "Logout" : "Login"}
                  </Button>
                  <NewTaskBtn onClick={this.toggleCreateForm} color="success">
                    New task
                  </NewTaskBtn>
                </BtnPanel>
              </Col>
            </RowWithMargin>
            <RowWithMargin>
              <Col xs={12}>
                {tasks.length ? (
                  <React.Fragment>
                    <PaginatedList
                      activePageNumber={activePageNumber}
                      totalPages={totalPages}
                      items={tasks}
                      renderItems={this.renderTasks}
                      setActivePage={this.setActivePage}
                    />
                  </React.Fragment>
                ) : (
                  <div>You've got no tasks.</div>
                )}
              </Col>
            </RowWithMargin>
          </Block>
          <LoginForm
            setAdmin={this.toggleIsAdmin}
            isOpen={isLoginFormOpen}
            closeModal={this.toggleLoginModal}
          />
          <CreateTaskForm
            toggleModal={this.toggleCreateForm}
            addTask={this.addTask}
            isOpen={isCreateFormOpen}
            onTaskAdded={this.onTaskAdded}
          />
        </Container>
      </AppWrapper>
    );
  }
}

export default App;
