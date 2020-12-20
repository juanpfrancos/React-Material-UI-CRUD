import React, { useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField'
import Edit from './editar'
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

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)* 2,
      textAlign: 'center'
    },
  },
  card: { margin: theme.spacing(1) * 2, maxWidth: 300 },
  progress: { margin: theme.spacing(2) }
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
  const [loading, setLoading] = useState(true) /*Loading progress */
  const [add, setAdd] = useState(false)
  const [edit, setEdit] = useState(false)
    /*Input form state*/
    const [data, setData] = useState({
      name: '',
      price: '',
      reference: '',
    })
    
    const inputChange = (event) =>{
      setData({
        ...data,
        [event.target.name]:event.target.value,
      })
    }
  /* Input form state*/
  const sendData = (event) =>{
    event.preventDefault();
    axios.post('http://localhost:8000/Products/',data)
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

  useEffect(async()=>{
    await peticionGet();
    setLoading(false);
  },[])

  const peticionGet=async()=>{
    await axios.get('http://localhost:8000/Products/')
    .then(response=>{
      setRows(response.data);
    })
  }

  const peticionDelete=async()=>{
    await axios.delete('http://localhost:8000/Products/'+selRow.id+'/')
    .then(response=>{
      setRows(rows.filter(row=>row.id!==selRow.id)) /*Actualiza el state excluyendo el campo eliminado*/
      alert('Producto eliminado')
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
      {`(${selections()}) rows selected`}
      </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.name}
                >
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
        <MaybeLoading loading={loading} />
        <Container>
          <Button variant="contained" disabled={buttonDelete} onClick={()=>peticionDelete()}>Eliminar</Button>
          <Button variant="contained" disabled={buttonEdit} onClick={()=> setEdit(true)}>Editar</Button>
          <Button variant="contained"  onClick={()=> setAdd(true)}>Nuevo</Button>
        </Container>
      </Paper>
      {add ?
      <>
        <Typography variant="h3">Agregar Producto</Typography>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={sendData}>
          <TextField id="outlined-basic" label="Producto" variant="outlined" name="name" onChange={inputChange} />
          <TextField id="outlined-basic" label="Precio" variant="outlined" name="price" onChange={inputChange}/>
          <TextField id="outlined-basic" label="Referencia" variant="outlined" name="reference" onChange={inputChange}/>
          <Button variant="contained" color="primary" type="submit">
            Guardar
          </Button>
        </form>
      </>
      : null}

      {edit ? 
        
      <Edit id={selRow.id} product={selRow.name} price={selRow.price} reference={selRow.reference} onLoad={()=> setAdd(false)} />
      : null}
      </>
    )
}

export default Tab