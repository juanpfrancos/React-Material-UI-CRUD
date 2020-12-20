import React, {useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}))

function Edit(props){

    const [data, setData] = useState({
      name: props.product,
      price: props.price,
      reference: props.reference,
    })

    const inputChange = (event) =>{
      setData({
        ...data,
        [event.target.name]:event.target.value,
      })
    }

    const sendData = async(event) =>{
      event.preventDefault();
      await axios.put('http://localhost:8000/Products/'+props.id+'/', data)
      .then(function (response)  {
        setRows(rows.filter(row=>row.id!==selRow.id))
        console.log(response);
      })
      .catch(function (error)  {
        console.log(error);
      })
    }


    const classes = useStyles();
    return (
        <>
          <Typography variant="h3">Modificar Producto</Typography>
        <form className={classes.root} noValidate autoComplete="off" onSubmit={sendData}>
            <TextField id="outlined-basic" label="Producto" variant="outlined" name="name" onChange={inputChange} value={data.name} />
            <TextField id="outlined-basic" label="Precio" variant="outlined" name="price" onChange={inputChange} value={data.price} />
            <TextField id="outlined-basic" label="Referencia" variant="outlined" name="reference" onChange={inputChange} value={data.reference} />
            <Button variant="contained" color="primary" type="submit">
              Guardar
            </Button>
        </form>
        </>
    )
}

export default Edit