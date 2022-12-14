import Link from "next/link";
import { useState } from "preact/hooks";
import { WikiPage } from "../lib/data";
import { escapeRegExp, slugToTitle, slugToUrl } from "../lib/string";

const query = (x: WikiPage, q: string) => {
  const pageTitle = slugToTitle(x.slug).toLowerCase();
  const content = x.content.toLowerCase().replace(/<\/?[^>]+>/gm, "");

  let score = 0;
  for (const word of q.toLowerCase().split(/\s+/)) {
    const wordRegex = new RegExp(escapeRegExp(word), "gi");
    for (const meta of x.meta) {
      score += meta[0].toLowerCase().match(wordRegex)?.length ?? 0;
      score += meta[1].toString().toLowerCase().match(wordRegex)?.length ?? 0;
    }

    score += (pageTitle.match(wordRegex)?.length ?? 0) * 100;
    score += content.match(wordRegex)?.length ?? 0;
  }

  return score;
};

export const Header = (props: { allPages: Array<WikiPage> }) => {
  const [value, setValue] = useState("");
  const clearSearch = () => {
    setValue("");
  };

  return (
    <>
      <Link href="/">
        <a className="fixed top-4 left-2 w-fit h-fit cursor-pointer z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="w-auto h-12" src="/favicon.webp" alt="Home" />
        </a>
      </Link>
      {props.allPages && props.allPages.length > 1 ? (
        <label className="flex fixed top-4 right-4 sm:left-auto left-14 z-20 items-center sm:w-72 text-left space-x-3 px-4 h-12 ring-slate-900/10 focus:outline-none focus:ring-2 shadow-sm rounded-lg bg-slate-800 ring-0 text-slate-400 highlight-white/5 hover:bg-slate-700">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="flex-none text-slate-400"
            aria-hidden="true"
          >
            <path d="m19 19-3.5-3.5"></path>
            <circle cx="11" cy="11" r="6"></circle>
          </svg>
          <input
            className="flex-auto"
            placeholder="Search..."
            value={value}
            onChange={(ev) => {
              setValue(ev.target.value);
            }}
          />
        </label>
      ) : null}
      {value && props.allPages && props.allPages.length > 1 ? (
        <>
          <div
            onClick={clearSearch}
            className="fixed z-10 backdrop-blur bg-slate-900 bg-opacity-25 inset-0 w-screen h-screen"
          ></div>
          <ul className="fixed z-50 px-4 py-6 rounded-lg top-20 bottom-1/2 sm:bottom-1/4 inset-x-4 sm:max-w-md sm:w-full sm:mx-auto sm:inset-x-0 bg-slate-700">
            {props.allPages
              ? props.allPages
                  .filter((x) => query(x, value))
                  .sort((a, b) => {
                    if (query(a, value) > query(b, value)) {
                      return -1;
                    }
                    if (query(a, value) < query(b, value)) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((page) => (
                    <li
                      key={"q." + page.slug}
                      onClick={clearSearch}
                      className="w-full"
                    >
                      <Link href={"/wiki/" + slugToUrl(page.slug)}>
                        <a className="block hover:bg-slate-800 rounded-lg px-3 py-4 w-full text-slate-400 hover:text-slate-50">
                          {slugToTitle(page.slug)}
                        </a>
                      </Link>
                    </li>
                  ))
              : null}
          </ul>
        </>
      ) : null}
    </>
  );
};
