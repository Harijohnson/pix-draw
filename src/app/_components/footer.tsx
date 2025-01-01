import { assert } from "console";
import Container from "@/app/_components/container";

export function Footer() {
  return (
    <footer >
      <Container>
        <div className="flex  items-center justify-center border-t h-24">
          <h3 className="text-center">
          Copyright Hari - 2024
          </h3>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
