export default function (dateString: string): Date | null {

    const [datePart, timePart] = dateString.split(' ');

    const [day, month, year] = datePart.split('/');
    const fullYear = parseInt(year, 10) + 2000;
    let date
    if (timePart) {
        const [hours, minutes, seconds] = timePart.split(':');
         date = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hours, 10), parseInt(minutes, 10), parseInt(seconds, 10));
        
    }else{
        date = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
    }
    if (isNaN(date.getTime())) {
        console.error('Data inválida');
        return null;
    }

    return date;
}