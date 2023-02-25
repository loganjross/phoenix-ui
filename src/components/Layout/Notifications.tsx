import { useTheme } from "styled-components";
import { Toaster } from "react-hot-toast";

export const Notifications = () => {
  const theme = useTheme();

  return (
    <Toaster
      position="bottom-center"
      gutter={theme.spacing * 2}
      toastOptions={{
        style: {
          maxWidth: "375px",
          padding: `${theme.spacing / 2}px ${theme.spacing * 1.5}px`,
          color: theme.palette.text,
          fontSize: theme.fontSize.base,
          background: theme.palette.base,
          borderRadius: theme.radius * 10 + "px",
          boxShadow: theme.shadow,
          transitionDuration: theme.transition + "s",
        },
      }}
      containerStyle={{
        marginBottom: theme.spacing * 4 + "px",
      }}
    />
  );
};
