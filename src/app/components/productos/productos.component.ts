import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Producto } from '../../models/producto';
import { ProductosService } from '../../services/productos.service';
//import {ProductosService} from '../../services/productos.services'; 

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  Titulo = 'Productos';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Producto[] = null;
  RegistrosTotal: number;
  Pagina = 1; // inicia pagina 1
  submitted: boolean = false;

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' }
  ];

  FormBusqueda: FormGroup;
  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private ProductosService: ProductosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormBusqueda = this.formBuilder.group({
      Nombre: [null],
      Activo: [null]
    });
    this.FormRegistro = this.formBuilder.group({
      IdArticulo: [null],
      ProductoNombre: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      ProductoFechaAlta: [
        null,
        [
          Validators.required,
          Validators.pattern(
              '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
            )
          
        ]
      ],
      SProductoStock: [null, [Validators.required, Validators.pattern('^\\d{1,10}$')]],
    });

  }


  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({ Activo: true, IdArticulo: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }

  // Buscar segun los filtros, establecidos en FormRegistro
  Buscar() {
    //this.modalDialogService.BloquearPantalla();
    this.ProductosService
      .get( )
      //this.articulosService.get("", null, this.Pagina)
      .subscribe((res: any) => {
        this.Items = res;
        //this.modalDialogService.DesbloquearPantalla();
      });
  }


  // grabar tanto altas como modificaciones
  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    // agregar post
    if (this.AccionABMC == 'A') {
      //this.modalDialogService.BloquearPantalla();
      this.ProductosService.post(itemCopy).subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert('Registro agregado correctamente.');
        this.Buscar();
        //this.modalDialogService.DesbloquearPantalla();
      });
    } else {
      
    }
  }

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
}
