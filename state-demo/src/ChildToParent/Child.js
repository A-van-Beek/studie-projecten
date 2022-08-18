import React from "react";
import { Button } from "semantic-ui-react";

export default function Child({ childToParent }) {
  const data = "data from Child Component to the Parent.";
  return (
    <div>
      <Button primary onClick={() => childToParent(data)}>
        Click Child To Parent
      </Button>
    </div>
  );
}
