import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useData } from "../../providers/DataProvider";
import { MAX_QUERY_TIMESTAMP, MIN_QUERY_TIMESTAMP } from "../../utils/time";
import { BaseProps } from "../../styles/base";
import { Flex } from "../Layout";
import { Icon } from "../Icons";
import { FieldProps, FieldContainer, FieldLabel, StyledInput } from ".";

interface QueryDatePickerProps extends Omit<FieldProps, "value" | "onChange"> {
  isStartDate?: boolean;
}

export function QueryDatePicker({
  isStartDate,
  error,
  disabled,
  ...baseProps
}: QueryDatePickerProps & BaseProps) {
  const { startTimestamp, setStartTimestamp, endTimestamp, setEndTimestamp } =
    useData();
  const selectedDate =
    isStartDate && startTimestamp
      ? new Date(startTimestamp)
      : !isStartDate && endTimestamp
      ? new Date(endTimestamp)
      : undefined;
  const label = isStartDate ? "Date From" : "Date To";
  const hasValue = isStartDate ? !!startTimestamp : !!endTimestamp;

  function updateTimestamp(timestamp: number) {
    if (isStartDate) {
      setStartTimestamp(timestamp);
    } else {
      setEndTimestamp(timestamp);
    }
  }

  function resetTimestamp() {
    if (isStartDate) {
      setStartTimestamp(null);
    } else {
      setEndTimestamp(null);
    }
  }

  return (
    <FieldContainer
      w="125px"
      column
      label={label}
      error={error}
      disabled={disabled}
      {...baseProps}
    >
      <FieldLabel>{label}</FieldLabel>
      <DatePicker
        minDate={new Date(MIN_QUERY_TIMESTAMP)}
        maxDate={new Date(MAX_QUERY_TIMESTAMP)}
        selected={selectedDate}
        onChange={(date) => (date ? updateTimestamp(date.getTime()) : null)}
        customInput={
          <StyledInput
            w="100%"
            h="100%"
            py={1}
            px={1.5}
            cursor={disabled ? "not-allowed" : "pointer"}
          />
        }
      />
      <Flex cursor="pointer" onClick={resetTimestamp}>
        <Icon
          name={hasValue ? "close" : "chevron-down"}
          position="absolute"
          bottom={1.3}
          right={1}
        />
      </Flex>
    </FieldContainer>
  );
}
