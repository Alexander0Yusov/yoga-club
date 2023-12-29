import Container from "@/components/0_ui/Container/Container";
import { authConfig } from "@/configs/auth";
import { getServerSession } from "next-auth";

const Footer = async () => {
  const session = await getServerSession(authConfig);
  return (
    <footer>
      <Container className="flex flex-col justify-center items-center border-[1px] border-orange-950 py-[0px]">
        <h2>Footer</h2>

        <p>this is serverside component for display username:</p>

        {/* {попробовать перевести показ сессии на клиента} */}
        <p>{session?.user?.name}</p>
      </Container>
    </footer>
  );
};

export default Footer;
