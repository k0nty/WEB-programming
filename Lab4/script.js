const MySortLib = {
    bubbleSort: function(arr, rise = true) {
        let comparisons = 0, swaps = 0;
        let newArr = [...arr].filter(x => x !== undefined);
        let hasUndefined = arr.length !== newArr.length;
        
        for (let i = 0; i < newArr.length; i++) {
            for (let j = 0; j < newArr.length - i - 1; j++) {
                comparisons++;
                if (rise ? newArr[j] > newArr[j + 1] : newArr[j] < newArr[j + 1]) {
                    [newArr[j], newArr[j + 1]] = [newArr[j + 1], newArr[j]];
                    swaps++;
                }
            }
        }
        this.logResults("Bubble Sort", comparisons, swaps, hasUndefined);
        return newArr;
    },

    selectionSort: function(arr, rise = true) {
        let comparisons = 0, swaps = 0;
        let newArr = [...arr].filter(x => x !== undefined);
        let hasUndefined = arr.length !== newArr.length;
        
        for (let i = 0; i < newArr.length - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < newArr.length; j++) {
                comparisons++;
                if (rise ? newArr[j] < newArr[minIdx] : newArr[j] > newArr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [newArr[i], newArr[minIdx]] = [newArr[minIdx], newArr[i]];
                swaps++;
            }
        }
        this.logResults("Selection Sort", comparisons, swaps, hasUndefined);
        return newArr;
    },

    insertionSort: function(arr, rise = true) {
        let comparisons = 0, swaps = 0;
        let newArr = [...arr].filter(x => x !== undefined);
        let hasUndefined = arr.length !== newArr.length;
        
        for (let i = 1; i < newArr.length; i++) {
            let key = newArr[i];
            let j = i - 1;
            while (j >= 0 && (rise ? newArr[j] > key : newArr[j] < key)) {
                comparisons++;
                newArr[j + 1] = newArr[j];
                j--;
                swaps++;
            }
            newArr[j + 1] = key;
        }
        this.logResults("Insertion Sort", comparisons, swaps, hasUndefined);
        return newArr;
    },

    shellSort: function(arr, rise = true) {
        let comparisons = 0, swaps = 0;
        let newArr = [...arr].filter(x => x !== undefined);
        let hasUndefined = arr.length !== newArr.length;
        
        let n = newArr.length;
        for (let gap = Math.floor(n/2); gap > 0; gap = Math.floor(gap/2)) {
            for (let i = gap; i < n; i++) {
                let temp = newArr[i];
                let j = i;
                while (j >= gap && (rise ? newArr[j-gap] > temp : newArr[j-gap] < temp)) {
                    comparisons++;
                    newArr[j] = newArr[j - gap];
                    j -= gap;
                    swaps++;
                }
                newArr[j] = temp;
            }
        }
        this.logResults("Shell Sort", comparisons, swaps, hasUndefined);
        return newArr;
    },

    quickSort: function(arr, rise = true) {
        let comparisons = 0, swaps = 0;
        let newArr = [...arr].filter(x => x !== undefined);
        let hasUndefined = arr.length !== newArr.length;
        
        const quickSortHelper = (array, low, high) => {
            if (low < high) {
                let pi = partition(array, low, high);
                quickSortHelper(array, low, pi - 1);
                quickSortHelper(array, pi + 1, high);
            }
            return array;
        };
        
        const partition = (array, low, high) => {
            let pivot = array[high];
            let i = low - 1;
            for (let j = low; j <= high - 1; j++) {
                comparisons++;
                if (rise ? array[j] < pivot : array[j] > pivot) {
                    i++;
                    [array[i], array[j]] = [array[j], array[i]];
                    swaps++;
                }
            }
            [array[i + 1], array[high]] = [array[high], array[i + 1]];
            swaps++;
            return i + 1;
        };
        
        quickSortHelper(newArr, 0, newArr.length - 1);
        this.logResults("Quick Sort", comparisons, swaps, hasUndefined);
        return newArr;
    },

    logResults: function(methodName, comparisons, swaps, hasUndefined) {
        console.log(`${methodName}:`);
        console.log(`Comparisons: ${comparisons}`);
        console.log(`Swaps: ${swaps}`);
        if (hasUndefined) {
            console.log("Array contained undefined elements which were removed before sorting");
        }
    }
};