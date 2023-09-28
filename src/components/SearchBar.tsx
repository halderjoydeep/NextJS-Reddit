"use client";

import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import { Prisma, Subreddit } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import debounce from "lodash.debounce";
import { Users } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface SearchBarProps {}

const SearchBar: React.FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  const commandRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(commandRef, () => setInput(""));

  const {
    data: queryResults,
    refetch,
    isFetched,
    isFetching,
  } = useQuery({
    queryFn: async () => {
      if (!input) return [];
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });

  const request = debounce(async () => refetch(), 300);

  const debounceRequest = useCallback(() => {
    request();
  }, []);

  useEffect(() => {
    setInput("");
  }, [pathname]);

  return (
    <Command
      className="relative z-50 max-w-lg overflow-visible rounded-lg  border"
      ref={commandRef}
    >
      <CommandInput
        placeholder="Search communities..."
        value={input}
        onValueChange={(text) => {
          setInput(text);
          debounceRequest();
        }}
        isLoading={isFetching}
      />
      {input.length > 0 && (
        <CommandList className="absolute inset-x-0 top-full rounded-b-md bg-white shadow">
          {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
          {(queryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Communities">
              {queryResults?.map((subreddit) => (
                <CommandItem
                  className="cursor-pointer"
                  onSelect={() => {
                    router.push(`/r/${subreddit.name}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  r/{subreddit.name}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  );
};

export default SearchBar;
