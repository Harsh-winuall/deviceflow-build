import { render, screen } from "@testing-library/react";
import { Table } from "./Table";

let data = [
  { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
  { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
  { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
  { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
  { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
];
let columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
  },
  {
    title: "Last",
    dataIndex: "lastName",
  },
  ,
  {
    title: "Age",
    dataIndex: "age",
  },
];

describe("Testing Table", () => {
  it("Render Table Successfully", () => {
    const { getByText } = render(<Table data={data} columns={columns} />);
    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Daenerys")).toBeInTheDocument();
  });

  it("Render Table with Checkbox Successfully", () => {
    const { getAllByRole } = render(
      <Table
        data={data}
        columns={columns}
        checkboxSelection={{ uniqueField: "id" }}
      />
    );
    expect(getAllByRole("checkbox"));
  });
});
