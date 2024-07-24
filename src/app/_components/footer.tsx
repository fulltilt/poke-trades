"use client";

export function Footer() {
  return (
    <nav className="flex w-full items-center justify-center bg-black p-4 text-center text-[10px] font-semibold text-white">
      <div className="flex flex-col items-center gap-4">
        <p>
          Pokémon and its trademarks are ©1995-2024 Nintendo, Creatures, and
          GAMEFREAK. English card images appearing on this website are the
          property of The Pokémon Company International, Inc.
        </p>

        <p>
          PokeTrades.com is not official in any shape or form, nor affiliated,
          sponsored, or otherwise endorsed by Nintendo, Creatures, GAMEFREAK, or
          TPCi.
        </p>
      </div>
    </nav>
  );
}
