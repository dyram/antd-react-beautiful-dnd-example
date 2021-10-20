import { Typography, Input, Space, Form, Button, message } from "antd";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "antd/dist/antd.css";

const { Title } = Typography;

export default function App() {
  // form methods
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log({ formSubmissionValues: values });
    message.success({
      content: <span>Pipeline created, check values in INSPECTOR CONSOLE</span>,
      duration: 2,
    });
  };

  // mock data
  const [stages, setStages] = useState([
    { title: "stage1" },
    { title: "stage2" },
    { title: "stage3" },
    { title: "stage4" },
  ]);

  // reorder fn
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  // dragend fn
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      stages,
      result.source.index,
      result.destination.index
    );

    setStages(items);
  };

  // styles

  // first param to check if item is being dragged
  // second param are default style from react-beautiful-dnd library
  const itemStyle = (isDragging, draggableStyle) => ({
    padding: 8,
    background: isDragging ? "#535ADF" : "none",
    ...draggableStyle,
  });

  // only 1 param to check if dragging of item is over
  const listStyle = (isDraggingOver) => ({
    padding: 8,
    background: isDraggingOver ? "#E8E8E8" : "none",
  });

  // add and remove stages method -- POC placeholders dont take seriously
  const addStage = () => {
    setStages([...stages, { title: `stage${stages.length + 1}` }]);
  };
  const removeStage = (stageName) => {
    let newStages = stages.filter((s) => s.title !== stageName);
    setStages(newStages);
  };

  return (
    <>
      <Title level={3}>Drag and drop (DND) test</Title>

      <Form form={form} onFinish={onFinish} style={{ padding: 8 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={listStyle(snapshot.isDraggingOver)}
              >
                {stages.map((item, index) => (
                  <Draggable
                    key={item.title}
                    draggableId={item.title}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={itemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        <Space size={20}>
                          <span {...provided.dragHandleProps}>::</span>
                          <Form.Item noStyle name={`disabledStage${index}`}>
                            <Input
                              type="text"
                              disabled
                              placeholder={item.title}
                            />
                          </Form.Item>
                          <Form.Item noStyle name={`Item${item.title}`}>
                            <Input type="text" />
                          </Form.Item>
                          {index === stages.length - 1 ? (
                            <Button onClick={addStage}>+</Button>
                          ) : (
                            <Button
                              type="primary"
                              danger
                              onClick={() => removeStage(item.title)}
                            >
                              Delete
                            </Button>
                          )}
                        </Space>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Form.Item>
          <Button htmlType="submit" type="primary">
            Create Pipeline
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
