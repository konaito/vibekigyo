const openrouterapikey = process.env.OPENROUTER_API_KEY;

if (!openrouterapikey || openrouterapikey.length < 10) {
  throw new Error("OPENROUTER_API_KEY is not set or is too short.");
}

export { openrouterapikey };