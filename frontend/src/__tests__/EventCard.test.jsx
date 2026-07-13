import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import EventCard from "../components/EventCard";

describe("EventCard Component", () => {
  const mockEvent = {
    id: 1,
    titulo: "Taller de Git y GitHub",
    expositor: "Ing. Carlos Ramos",
    descripcion: "Aprende control de versiones y flujo de trabajo colaborativo.",
    tipo: "Taller",
    fecha: "2026-08-10",
    hora: "10:00:00",
    lugar: "Aula 301",
    capacidad: 40,
    inscritos: 10
  };

  const mockCallbacks = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onInscribe: vi.fn(),
    onViewInscribed: vi.fn()
  };

  it("debe renderizar correctamente los datos del evento", () => {
    render(<EventCard event={mockEvent} {...mockCallbacks} />);

    expect(screen.getByText("Taller de Git y GitHub")).toBeInTheDocument();
    expect(screen.getByText("Expositor: Ing. Carlos Ramos")).toBeInTheDocument();
    expect(screen.getByText("Aprende control de versiones y flujo de trabajo colaborativo.")).toBeInTheDocument();
    expect(screen.getByText("Taller")).toBeInTheDocument();
    expect(screen.getByText("Aula 301")).toBeInTheDocument();
    expect(screen.getByText("Inscritos: 10")).toBeInTheDocument();
    expect(screen.getByText("Aforo: 40")).toBeInTheDocument();
    expect(screen.getByText("25% ocupado")).toBeInTheDocument();
  });

  it("debe calcular el aforo y rellenar la barra de progreso correctamente", () => {
    render(<EventCard event={mockEvent} {...mockCallbacks} />);
    
    const fillBar = screen.getByTestId("capacity-fill-bar");
    expect(fillBar).toHaveStyle("width: 25%");
  });

  it("debe deshabilitar el botón de inscripción si el aforo está completo", () => {
    const fullEvent = { ...mockEvent, inscritos: 40 };
    render(<EventCard event={fullEvent} {...mockCallbacks} />);

    const inscribeBtn = screen.getByTitle("Aforo completo");
    expect(inscribeBtn).toBeDisabled();
  });

  it("debe llamar a los callbacks de editar, eliminar e inscritos al hacer click", () => {
    render(<EventCard event={mockEvent} {...mockCallbacks} />);

    // Editar
    const editBtn = screen.getByTitle("Editar evento");
    fireEvent.click(editBtn);
    expect(mockCallbacks.onEdit).toHaveBeenCalledWith(mockEvent);

    // Eliminar
    const deleteBtn = screen.getByTitle("Eliminar evento");
    fireEvent.click(deleteBtn);
    expect(mockCallbacks.onDelete).toHaveBeenCalledWith(mockEvent.id);

    // Ver inscritos
    const viewBtn = screen.getByTitle("Ver alumnos inscritos");
    fireEvent.click(viewBtn);
    expect(mockCallbacks.onViewInscribed).toHaveBeenCalledWith(mockEvent);

    // Inscribir
    const inscribeBtn = screen.getByTitle("Inscribir participante");
    fireEvent.click(inscribeBtn);
    expect(mockCallbacks.onInscribe).toHaveBeenCalledWith(mockEvent);
  });
});
