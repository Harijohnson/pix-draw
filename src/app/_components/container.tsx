type Props = {
    children?: React.ReactNode;
  };
  
  const Container = ({ children }: Props) => {
    return <div className="container px-20 ">{children}</div>;
  };
  
  export default Container;