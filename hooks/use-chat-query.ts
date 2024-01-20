import { useSocket } from "@/components/providers/socket-provider";
import { useParams } from "next/navigation";
import qs from "query-string";

type ChatQueryProps = {
  queryKey: string;
  apiUrl: string;
  paramkey: "channelId" | "conversationId";
  paramvalue: string;
};

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramkey,
  paramvalue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();
  const params = useParams();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramkey]: paramvalue,
        },
      },
      {
        skipNull: true,
      }
    );
    const res = await fetch(url);
    return res.json();
  };
};
