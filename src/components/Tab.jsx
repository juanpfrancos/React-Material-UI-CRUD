import React, { useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField'
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

const baseURL='https://drfproducts.azurewebsites.net/Products/'

const useStyles = makeStyles(theme => ({
  root: { margin: theme.spacing(1) * 2, padding:theme.spacing(1) * 2, textAlign: 'center'},
  progress: { margin: theme.spacing(2) },
  mg: { margin:theme.spacing(1)},
  contbutt: {paddingTop:theme.spacing(2)}
}));


function MaybeLoading({ loading }) {
  const classes = useStyles();
  return loading ? (
    <CircularProgress className={classes.progress} />
  ) : null;
}

function Tab(){

  const [buttonDelete, setButtonDelete]=useState(true); /*Disable Delete Button */
  const [buttonEdit, setButtonEdit]=useState(true); /*Disable Edit Button */
  const [rows, setRows]=useState([]);      /*Rows State*/
  const [selRow, setSelRow]=useState([]);  /*Row Selected State*/
  const [columns, setColumns] = useState([ /*Columns State*/
    { name: 'ID', active: false },
    { name: 'Name', active: false },
    { name: 'Price', active: false, numeric: true },
    { name: 'Reference', active: false },
  ]);
  const [loading, setLoading] = useState(true) /*Loading progress state */
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
  const [data, setData] = useState({
      name: '',
      price: '',
      reference: '',
    }) /*Input create form state*/

    /* Use async await for loading */
  useEffect(async()=>{
    await  peticionGet();
    setLoading(false);
  },[])

  
  const peticionGet=async()=>{
    await axios.get(baseURL)
    .then(response=>{
      setRows(response.data);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete(baseURL+selRow.id+'/')
    .then(response=>{
      setRows(rows.filter(row=>row.id!==selRow.id)) /*Actualiza el state excluyendo el campo eliminado*/
      alert('Producto eliminado')
    })
  }
  
  /* Input form state*/
  const sendData = (event) =>{
    event.preventDefault();
    axios.post(baseURL,data)
    .then(function(response){
      console.log(response);
      console.log(data);
      setRows(rows.concat(response.data)) /*Añade al state de la tabla el producto enviado a la API */
      event.target.reset() /*Reseteal el formulario después de enviar el producto*/
    })
    .catch(function (error)  {
      console.log(error);
    })
  }

  const sendPutData = async(event) =>{
    event.preventDefault();
    await axios.put(baseURL+selRow.id+'/', selRow)
    .then(function(){
      let dataNueva=rows;
      dataNueva = dataNueva.map(rows=>{
        if(selRow.id===rows.id){
          rows.name=selRow.name;
          rows.price=selRow.price;
          rows.reference=selRow.reference;
        }
        return rows;
      })
      console.table(dataNueva);
      setRows(dataNueva);
    })
    .catch(function (error)  {
      console.log(error);
    })
  }

  const inputChange = (event) =>{
    setData({
      ...data,
      [event.target.name]:event.target.value,
    })
  }

  const inputEditChange = (event) =>{
    setSelRow({
      ...selRow,
      [event.target.name]:event.target.value,
    })
  }

  const onRowClick = id => () => {
    const newRows = [...rows];
    const index = rows.findIndex(row => row.id === id);
    const row = rows[index]
    setSelRow(rows[index]) /*Añade al estado la fila seleccionada*/

    /*Añade al state el campo selected true a las filas seleccionadas*/
    newRows[index] = { ...row, selected: !row.selected }; 
    setRows(newRows);

    //Habilita los botones editar y eliminar
    setButtonDelete(false)
    setButtonEdit(false)
    //Desahabilita los botones editar y eliminar cuando hay mas de una selección
    if(selections()>0){
      setButtonEdit(true)
      setButtonDelete(true)
    }
  };

 const selections = () => rows.filter(row => row.selected).length; /*Count selections number*/
 

  const classes = useStyles();
    return (
        <>
      <Paper className={classes.root}>
      <Typography variant="h4" id="tableTitle">
      {`(${selections()}) Productos Seleccionados`}
      </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.name}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow
                key={row.id}
                onClick={onRowClick(row.id)}
                selected={row.selected}
              >
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.reference}</TableCell>
              </TableRow>
            ))}     
          </TableBody>
        </Table>
        <MaybeLoading className={classes.root} loading={loading} />
        <Container className={classes.contbutt}>
          <Button className={classes.mg} variant="contained" disabled={buttonDelete} onClick={()=>{peticionDelete(); setAdd(false); setEdit(false);}}>Eliminar</Button>
          <Button className={classes.mg} variant="contained" disabled={buttonEdit} onClick={()=>{setEdit(true); setAdd(false);}}>Editar</Button>
          <Button className={classes.mg} variant="contained" onClick={()=>{setAdd(true); setEdit(false);}}>Nuevo</Button>
        </Container>
    
      {add ?
      <>
        <Typography variant="h3">Agregar Producto</Typography>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={sendData}>
          <TextField className={classes.mg} id="outlined-basic" label="Producto" variant="outlined" name="name" onChange={inputChange} />
          <TextField className={classes.mg} id="outlined-basic" label="Precio" variant="outlined" name="price" onChange={inputChange}/>
          <TextField className={classes.mg} id="outlined-basic" label="Referencia" variant="outlined" name="reference" onChange={inputChange}/>
          <Button className={classes.mg} variant="contained" color="primary" type="submit" size={'large'}>
            Guardar
          </Button>
        </form>
      </>
      : null}

      {edit ? 
        <>
        <Container >
          <Typography variant="h3">Modificar Producto</Typography>
          <form className={classes.root} noValidate autoComplete="off" onSubmit={sendPutData}>
              <TextField className={classes.mg} id="outlined-basic" label="Producto" variant="outlined" name="name" onChange={inputEditChange} value={selRow.name} />
              <TextField className={classes.mg} id="outlined-basic" label="Precio" variant="outlined" name="price" onChange={inputEditChange} value={selRow.price} />
              <TextField className={classes.mg} id="outlined-basic" label="Referencia" variant="outlined" name="reference" onChange={inputEditChange} value={selRow.reference} />
              <Button className={classes.mg} variant="contained" color="primary" type="submit" size={'large'}>
                Guardar
              </Button>
          </form>
        </Container>
        </>
        : null}
        </Paper>
      </>
    )
}

export default Tab