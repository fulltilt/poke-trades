"use client";

import { ActionTypes, useAppContext } from "~/app/_components/reducer";
import { Button } from "~/components/ui/button";

export default function ButtonComponent() {
  const { dispatch } = useAppContext();

  return (
    <Button
      onClick={() => dispatch({ type: ActionTypes.INCREMENT, payload: 8 })}
    >
      Request Trade
    </Button>
  );
}
