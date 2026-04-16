import FilmSearch from "@/components/FilmSearch";

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-gray-900">
          Discover Amazing Films
        </h2>
        <p className="text-lg text-gray-600">
          Search for films and get AI-powered insights and overviews. In the future, you will be able to favorite films and make community posts!
        </p>
      </div>

      <FilmSearch />
    </div>
  );
}
