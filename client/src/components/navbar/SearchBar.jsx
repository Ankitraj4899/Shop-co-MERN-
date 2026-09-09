import search1 from "../../assets/icons/search1.svg";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, onTriggerSearch }) => {
  return (
    <div className="search__wrapper">
      <img
        src={search1}
        className="search"
        alt=""
        onClick={onTriggerSearch}
      />
      <input
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onInput={(e) => setSearchTerm(e.target.value)}
        onKeyDown={onSearch}
        placeholder="Search for products..."
        className="navbar__search"
      />
    </div>
  );
};

export default SearchBar;
