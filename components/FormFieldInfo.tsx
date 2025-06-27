import { AnyFieldApi } from "@tanstack/react-form";
import { Text } from "@rn-vui/themed";

export default function FormFieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <Text style={{ fontStyle: "italic" }}>
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </Text>
      ) : null}
    </>
  );
}
