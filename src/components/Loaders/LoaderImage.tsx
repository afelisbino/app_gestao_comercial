import imgLoader from "../../assets/images/loading-data.svg";

export function LoaderImage() {
  return (
    <>
      <div className="row text-center mb-2">
        <span className="h6">{"Carregando todos os dados..."}</span>
      </div>
      <div className="d-flex justify-content-center">
        <img
          src={imgLoader}
          alt="Carregando dados..."
          className="img-thumbnail border-0 w-25 h-auto m-2"
        />
      </div>
    </>
  );
}
